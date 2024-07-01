import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Picture } from '../model/Picture';
import { Category } from '../model/Category';
import { About } from '../model/About';
import { New } from '../model/New';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  // addPicture
  addPicture(picture: Picture) {
    picture.id = this.afs.createId();
    return this.afs.collection('/Pictures').add(picture);
  }

  // addCategory
  addCategory(category: Category) {
    category.id = this.afs.createId();
    return this.afs.collection('/Categories').add(category);
  }

  // addAbout
  addAbout(about: About) {
    about.id = this.afs.createId();
    return this.afs.collection('/about').add(about);
  }

  // addNew
  addNew(news: New) {
    news.id = this.afs.createId();
    return this.afs.collection('/News').add(news);
  }

  /*    ------------------ Obtener --------------------*/
  // getAllPictures
  getAllPictures() {
    return this.afs.collection('/Pictures').snapshotChanges();
  }

  // getAllCategories
  getAllCategories() {
    return this.afs.collection('/Categories').snapshotChanges();
  }

  // getAllNews
  getAllNews() {
    return this.afs.collection('/News').snapshotChanges();
  }

  // getAbout
  getAbout() {
    return this.afs.collection('/about').snapshotChanges();
  }

  // getPictureById
  getPictureById(id: string) {
    return this.afs.collection('/Pictures').doc(id).valueChanges();
  }

  // getCategoryById
  getCategoryById(id: string) {
    return this.afs.collection('/Categories').doc(id).valueChanges();
  }

  /* -------------- Eliminar ------------------ */

  // delete Picture
  deletePicture(picture: Picture) {
    return this.afs.doc('/Pictures/' + picture.id).delete();
  }

  // delete Category
  deleteCategory(category: Category) {
    return this.afs.doc('/Categories/' + category.id).delete();
  }

  // delete About
  deleteAbout(about: About) {
    return this.afs.doc('/about/' + about.id).delete();
  }

  // delete New
  deleteNew(news: New){
    console.log(news);
    return this.afs.doc('/News/' + news.id).delete();
  }

  /* ------------------ Editar -------------*/
  // update Picture
  updatePicture(picture: Picture) {
    this.deletePicture(picture);
    this.addPicture(picture);
  }

  // update Category
  updateCategory(category: Category) {
    this.deleteCategory(category);
    this.addCategory(category);
  }

  // update About
  updateAbout(about: About) {
    this.deleteAbout(about);
    this.addAbout(about);
  }
}
