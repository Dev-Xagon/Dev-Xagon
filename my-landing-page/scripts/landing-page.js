class LandingPageApp extends Application {
  static get defaultOptions() {
    const merge = foundry.utils.mergeObject;
    return merge(super.defaultOptions, {
      id: "landing-page-app",
      template: "modules/my-landing-page/templates/landing-page.html",
      title: "Landing Page",
      width: 600,
      height: "auto"
    });
  }

  constructor(options={}) {
    super(options);
    // Define the pages shown in the landing app
    this.pages = [
      {title: "Welcome", content: "<p>Welcome to the game!</p>"},
      {title: "Rules", content: "<p>Here are some rules...</p>"},
      {title: "Credits", content: "<p>Credits to the team...</p>"},
      {
        title: "Charactersheet",
        content:
          "<p><button type='button' class='open-character'>Open your Character Sheet</button></p>"
      },
      {
        title: "Inventory",
        content:
          "<p><button type='button' class='open-inventory'>Open your Inventory</button></p>"
      },
      {
        title: "Notizen an den DM",
        content:
          "<textarea class='note-dm' rows='4' cols='40' placeholder='Write a note to the DM'></textarea><br/><button type='button' class='send-dm'>Send to DM</button>"
      }
    ];
  }

  /**
   * Retrieve the current page index from the user's flags.
   */
  get pageIndex() {
    return game.user.getFlag("my-landing-page", "pageIndex") || 0;
  }

  /**
   * Store the current page index for this user.
   */
  async setPageIndex(index) {
    await game.user.setFlag("my-landing-page", "pageIndex", index);
    this.render(true);
  }

  /**
   * Provide data for the Handlebars template.
   */
  getData() {
    return {
      pages: this.pages,
      current: this.pageIndex,
      page: this.pages[this.pageIndex]
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    const total = this.pages.length;

    html.find("button.next").click(() => {
      const next = (this.pageIndex + 1) % total;
      this.setPageIndex(next);
    });

    html.find("button.prev").click(() => {
      const prev = (this.pageIndex + total - 1) % total;
      this.setPageIndex(prev);
    });

    html.find("button.open-character").click(() => {
      if (game.user.character) {
        game.user.character.sheet.render(true);
      } else {
        ui.notifications.warn("No character assigned to your user.");
      }
    });

    html.find("button.open-inventory").click(() => {
      const actor = game.user.character;
      if (!actor) {
        ui.notifications.warn("No character assigned to your user.");
        return;
      }
      const sheet = actor.sheet;
      sheet.render(true);
      if (typeof sheet.activateTab === "function") {
        sheet.activateTab("inventory");
      } else if (sheet._tabs?.[0]) {
        sheet._tabs[0].activate("inventory");
      }
    });

    html.find("button.send-dm").click(async () => {
      const textarea = html.find("textarea.note-dm");
      const content = textarea.val();
      if (!content) return;
      await ChatMessage.create({
        content,
        whisper: ChatMessage.getWhisperRecipients("GM")
      });
      ui.notifications.info("Message sent to the GM.");
      textarea.val("");
    });
  }
}

Hooks.once('ready', () => {
  // Show a welcome dialog greeting the user by their character name
  const actor = game.user.character;
  const name = actor ? actor.name : 'Abenteurer';
  let content = `<p>Hallo ${name}</p>`;
  if (actor && actor.img) {
    content += `<img src="${actor.img}" style="width:100%;height:auto;"/>`;
  }
  new Dialog({
    title: 'Willkommen',
    content,
    buttons: {
      ok: {
        label: 'OK'
      }
    }
  }).render(true);

  new LandingPageApp().render(true);
});

