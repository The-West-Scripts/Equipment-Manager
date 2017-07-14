// ==UserScript==
// @name         xEquipment Manager
// @version      0.3
// @description  A quick way of changing inventories in TW
// @author       Alin "xShteff" Olaru
// @website      https://xshteff.github.io
// @include      *.the-west.*/game.php*
// @downloadURL  https://xshteff.github.io/TW-xEquipment-Manager/quicksetthing.user.js
// @updateURL    https://xshteff.github.io/TW-xEquipment-Manager/quicksetthing.user.js
// @grant        none
// ==/UserScript==

var xEquipmentSets = {
    List: {},
    InitDropdown: function() {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function(data) {
            EquipManager.list = data.data;
            EquipManager.max = data.max;
            EquipManager.premiumMax = data.premium_max;
            EquipManager.hasPremium = data.hasPremium;
            var selectThing = new west.gui.Selectbox();
            selectThing.setHeader("Equipment Sets");
            for (var i = 0; i < EquipManager.list.length; i++) {
                var match = 0;
                var types = ['body', 'neck', 'head', 'right_arm', 'left_arm', 'animal', 'pants', 'belt', 'yield', 'foot'];
                $.each(types, function(el) {
                    if (Wear.get(types[el]) == null && EquipManager.list[i][types[el]] == null)
                        match++;
                    else if (Wear.get(types[el]) != null && Wear.get(types[el]).obj.item_id == EquipManager.list[i][types[el]])
                        match++;
                    else
                        match = 0;
                });
                if (match != 10) {
                    var title = '&lt;div id=&quot;equipshow_' + EquipManager.list[i].equip_manager_id + '&quot; style=&quot;height: 120px; width: 160px; high&quot; &gt;';
                    title += EquipManager.titlepart(i, 'neck', null, 105);
                    title += EquipManager.titlepart(i, 'head', null, 65);
                    title += EquipManager.titlepart(i, 'right_arm', 45, null);
                    title += EquipManager.titlepart(i, 'body', 65, 65);
                    title += EquipManager.titlepart(i, 'left_arm', 45, 145);
                    title += EquipManager.titlepart(i, 'animal', 85, null);
                    title += EquipManager.titlepart(i, 'pants', 105, 65);
                    title += EquipManager.titlepart(i, 'belt', 65, 105);
                    title += EquipManager.titlepart(i, 'yield', 85, 145);
                    title += EquipManager.titlepart(i, 'foot', 105, 105);
                    title += '&lt;/div&gt;';
                    var label = "<span title='" + title + "'>" + EquipManager.list[i].name + "</span>";
                    selectThing.addItem(i, label);

                }
                xEquipmentSets.List[i] = EquipManager.list[i].equip_manager_id;
            }
            selectThing.setWidth(200);
            selectThing.addListener(function(x) {
                EquipManager.switchEquip(xEquipmentSets.List[x]);
                new UserMessage("Equipment replaced successfully!", UserMessage.TYPE_SUCCESS).show();
            });
            var pos = $('#xequip_init_button').offset();
            pos.left -= 225;
            selectThing.divWrap.offset(pos);
            selectThing.divWrap.css('position', 'absolute');
            selectThing.show();
        });
    },
    InitButton: function() {
        var icon = $('<div></div>').attr({
            'title': 'xEquipment Sets',
            'class': 'menulink'
        }).css({
            'background': 'url("https://i.imgur.com/5LJ8hCP.png")',
            'background-position': '0px 0px'
        }).mouseleave(function() {
            $(this).css("background-position", "0px 0px");
        }).mouseenter(function(e) {
            $(this).css("background-position", "25px 0px");
        }).click(function() {
            xEquipmentSets.InitDropdown();
        });

        var cap = $('<div></div>').attr({
            'class': 'menucontainer_bottom'
        });

        $("#ui_menubar").append($('<div></div>').attr({
            'class': 'ui_menucontainer',
            'id': 'xequip_init_button'
        }).append(icon).append(cap));
    },
    RegisterToTWAPI: function() {
        var scriptInfo = "<h1>xEquipment Manager</h1>"
        scriptInfo += "<b><i>Some guy asked for this... here it is!</i></b>";
        scriptInfo += "<h1>Other scripts:</h1>";
        scriptInfo += "<li><a href='https://xshteff.github.io/userscripts/twbf.user.js' target='_blank'>TW Best Friends</a>";
        scriptInfo += "<li><a href='https://xshteff.github.io/userscripts/kappa.user.js' target='_blank'>TW Kappa</a>";
        scriptInfo += "<li><a href='https://xshteff.github.io/userscripts/twzoom.user.js' target='_blank'>TW Zoom</a></ul>";
        window.scriptyscript = {
            script: TheWestApi.register('xequip', 'xEquipment Manager', '2.1', Game.version.toString(), 'xShteff', 'https://xshteff.github.io'),
            setGui: function() {
                this.script.setGui(scriptInfo);
            },
            init: function() {
                this.setGui();
            }
        };
        window.scriptyscript.init();
    },
    Init: function() {
        xEquipmentSets.InitButton();
        xEquipmentSets.RegisterToTWAPI();
    }
}

xEquipmentSets.Init();