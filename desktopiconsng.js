#!/usr/bin/gjs

/* Desktop Icons GNOME Shell extension
 *
 * Copyright (C) 2017 Carlos Soriano <csoriano@redhat.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// this allows to import files from the current folder

imports.gi.versions.Gtk = '3.0';

let desktops = [];
let lastCommand = null;
let codePath = '.';
let error = false;
let zoom = 1.0;
for(let arg of ARGV) {
    if (lastCommand == null) {
        switch(arg) {
        case '-P':
        case '-D':
        case '-Z':
            lastCommand = arg;
            break;
        default:
            print("Parameter not recognized. Aborting.");
            error = true;
            break;
        }
        continue;
    }
    if (error) {
        break;
    }
    switch(lastCommand) {
    case '-P':
        codePath = arg;
        break;
    case '-D':
        let data = arg.split(";");
        desktops.push({x:parseInt(data[0]), y:parseInt(data[1]), w:parseInt(data[2]), h:parseInt(data[3])});
        break;
    case '-Z':
        zoom = parseFloat(arg);
        break;
    }
    lastCommand = null;
}

var extensionPath = codePath;
imports.searchPath.unshift(extensionPath);

const Prefs = imports.prefs;
const DBusUtils = imports.dbusUtils;

var Extension = {};

const DesktopManager = imports.desktopManager;

DBusUtils.init();
Prefs.init(extensionPath);

Extension.desktopManager = new DesktopManager.DesktopManager(desktops, zoom);
Extension.desktopManager.run();