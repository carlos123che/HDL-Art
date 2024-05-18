import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Picture } from '../model/Picture';
import { Category } from '../model/Category';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private afs: AngularFirestore) { }

  // addPicture
  addPicture( picture: Picture){
    picture.id = this.afs.createId();
    return this.afs.collection('/Pictures').add(picture);
  }
  
  
  // addCategory
  addCategory( category: Category){
    category.id = this.afs.createId();
    return this.afs.collection('/Categories').add(category);
  }

  /*    ------------------ Obtener --------------------*/
  // getAllPictures
  getAllPictures(){
    return this.afs.collection('/Pictures').snapshotChanges();
  }

   // getAllCategories
   getAllCategories(){
    return this.afs.collection('/Categories').snapshotChanges();
  }



  /* -------------- Eliminar ------------------ */

  // delete Picture
  deletePicture(picture: Picture){
    return this.afs.doc('/Pictures/' + picture.id).delete();
  }
  
  // delete Category
  deleteCategory(category: Category){
    return this.afs.doc('/Categories/' + category.id).delete();
  }







  /* ------------------ Editar -------------*/
  // update Picture
  updatePicture(picture : Picture){
    this.deletePicture(picture);
    this.addPicture(picture);
  }
  
  // update Category
  updateCategory(category : Category){
    this.deleteCategory(category);
    this.addCategory(category);
  }


}
