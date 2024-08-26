Hooks.once("init", () => {
  console.log("Initializing Prevent Identify Items by User");
  preventPlayerIdentifying();  
});

/**
 * Fixes https://github.com/foundryvtt/dnd5e/issues/2781
 */

function preventPlayerIdentifying() {
    
    // Prevent players from updating
    Hooks.on("preUpdateItem", (item, update) => {
      if (!game.user.isGM && "identified" in (update.system ?? {})) return false;
    });
  
    // Remove Identify button at top of Item Sheet
    Hooks.on("renderItemSheet", (sheet, [html]) => {
      if (game.user.isGM || sheet.item.system.identified || !sheet.isEditable) return;
      const label = html.querySelector(".dnd5e.sheet.item .sheet-header .item-subtitle .identified");
      label.querySelector("input").disabled = true;
      label.querySelector("i").remove();
    });
  
    // Remove Identify button from Item Context menu on Actor Sheet
    Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
      if (game.user.isGM || item.system.identified) return;
      buttons.findSplice((e) => e.name === "DND5E.Identify");
    });
  }
