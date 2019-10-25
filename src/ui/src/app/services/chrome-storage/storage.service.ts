import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static get<T>(name: string, obj: any): Observable<T> {
    return from(new Promise<T>((resolve, reject) => {
      chrome.storage[name].get({ obj }, (items) => {
        const err = chrome.runtime.lastError;

        if (err) {
          reject(err);
        } else {
          resolve(items.obj);
        }

      });
    }))
  }

  static set<T>(name: string, obj: T): Observable<T> {
    return from(new Promise<T>((resolve, reject) => {
      chrome.storage.sync.set({ obj }, () => {
        const err = chrome.runtime.lastError;

        if (err) {
          reject(err);
        } else {
          resolve(obj);
        }

      });
    }))
  }
}
