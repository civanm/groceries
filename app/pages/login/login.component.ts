import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { Page } from 'ui/page';
import { Color } from 'color';
import { View } from 'ui/core/view';
import { User } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';

@Component({
    selector: "my-app",
    providers: [UserService],
    templateUrl: './pages/login/login.html',
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]

})

export class LoginPage implements OnInit {
    user: User;
    isLoggingIn: boolean = true;
    isLoading: boolean = false;
    @ViewChild('container') container: ElementRef;

    constructor(private _userService: UserService, private _router: Router, private page: Page) {
        this.user = new User();
        this.user.email = 'user@nativescript.org';
        this.user.password = 'password';
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = this.page.ios ? "res://bg_login.jpg" : "res://bg_login";

    }

    submit() {
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.signUp();
        }
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
        let container = <View>this.container.nativeElement;
        container.animate({
            backgroundColor: this.isLoggingIn ? new Color('#ffffff') : new Color('#301217'),
            duration: 200
        });
    }

    login() {
        this.isLoading = true;
        this._userService.login(this.user)
            .subscribe(() => {
                this._router.navigate(['List']);
            }, (error) => {
                alert(error);
            }, () => {
                this.isLoading = false;
            })
    }
    signUp() {
        this.isLoading = true;
        this._userService.register(this.user)
            .subscribe(() => {
                alert("Your account was successfully created.");
                this.toggleDisplay();
            }, (error) => {
                alert("Unfortunately we were unable to create your account." + error.message);
            }, () => {
                this.isLoading = false;
            });
    }

}