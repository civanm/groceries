

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextField } from 'ui/text-field';
import { confirm, login } from 'ui/dialogs';
import { Grocery } from '../../shared/grocery/grocery';
import { GroceryListService } from '../../shared/grocery/grocery-list.service';

let socialShare = require('nativescript-social-share');

@Component({
    selector: 'list',
    templateUrl: 'pages/list/list.html',
    styleUrls: ['pages/list/list-common.css', 'pages/list/list.css'],
    providers: [GroceryListService]
})
export class ListPage implements OnInit {
    groceryList: Array<Grocery> = [];
    grocery: string = '';
    @ViewChild('groceryTextField') groceryTextField: ElementRef;
    isLoading: boolean = false;
    listLoaded: boolean = false;

    constructor(private _groceryListService: GroceryListService) {

    }

    ngOnInit() {
        this.isLoading = true;
        this._groceryListService.load()
            .subscribe((loadedGroceries) => {
                loadedGroceries.forEach((groceryObject: Grocery) => {
                    this.groceryList.unshift(groceryObject);
                });
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    add() {
        if (this.grocery.trim() === '') {
            alert('Please eneter a valid grocery');
            return;
        }

        //dismiss the keyboard (?)
        let textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this._groceryListService.add(this.grocery)
            .subscribe(groceryObject => {
                this.groceryList.unshift(groceryObject);
                this.grocery = '';
            });
    }

    delete(item: Grocery) {
        confirm({
            message: `Are you sure you want to delete '${item.name}'`, 
            okButtonText: "Yep",
            cancelButtonText: "Nope",
        }).then(result => {
            if (result) {
                this._groceryListService.delete(item.id)
                    .subscribe(() => {
                        let i = this.groceryList.indexOf(item);
                        this.groceryList.splice(i, 1);
                        console.log('removed', item.name);
                    })
            }
        });
    }

    share() {
        let list = this.groceryList.map(item => item.name);
        let listString = list.join(", ").trim();
        socialShare.shareText(listString);
    }
}