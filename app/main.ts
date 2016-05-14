import {nativeScriptBootstrap} from "nativescript-angular/application";
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from "./app.component";
import { enableProdMode } from '@angular/core';

enableProdMode();
nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS]);