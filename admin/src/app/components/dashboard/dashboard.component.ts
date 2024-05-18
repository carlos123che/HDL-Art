import { Component } from '@angular/core';
import { Picture } from 'src/app/model/Picture';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Category } from 'src/app/model/Category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent { 
  

  // File attributes  
  selectedFiles !:FileList;
  currentFileUpload !: FileMetaData;
  percentage : number = 0;

  listOfFiles : FileMetaData[] = [];

/* -- Picture Attributes -- */
  // Picture List
  picturesList : Picture[] = [];
  // Picture Object
  pictureObject : Picture = {
    id: '',
    title: '',
    series: '',
    category: [],
    price: 0,
    materials : '',
    url: ''
  };

  // Atribute for picture form
  title: string = '';
  series: string = '';
  category: string[] = []; 
  price: number = 0;
  materials: string = '';

/* -- Cateogires -- */
  categoryList: Category[] = [];

  constructor(private auth : AuthService, private data : DataService, private fireStorage : AngularFireStorage){}
  
  
  ngOnInit(): void{
    this.getAllPictures();
    this.getAllCategories();
  }


  
  getAllPictures(){
    this.data.getAllPictures().subscribe( res => {
      this.picturesList = res.map( (e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching the data');
    });
  }
  

  getAllCategories(){
    this.data.getAllCategories().subscribe( res => {
      this.categoryList = res.map( (e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching the data');
    });
  }



  addPicture(){
    // Validar vacios
    if(this.title == '' || this.category.length == 0){
      alert('Fill all fields.');
    }
    // Settear campos
    this.pictureObject.id = '';
    this.pictureObject.title = this.title;
    this.pictureObject.series = this.series;
    this.pictureObject.category = this.category;
    this.pictureObject.price = this.price;
    this.pictureObject.materials = this.materials;
      
    // Subir archivo
    this.currentFileUpload = new FileMetaData( this.selectedFiles[0]);
    const path = 'Uploads/' + this.currentFileUpload.file.name;

    const storageRef = this.fireStorage.ref(path);
    const uploadTask = storageRef.put(this.selectedFiles[0]);

    uploadTask.snapshotChanges().pipe( finalize( () => {
      storageRef.getDownloadURL().subscribe( downloadLink => {
        this.currentFileUpload.id = '';
        this.currentFileUpload.url = downloadLink;
        this.currentFileUpload.size = this.currentFileUpload.file.size;
        this.currentFileUpload.name = this.currentFileUpload.file.name;
        // Settear URL
        this.pictureObject.url =  downloadLink;

        // Guardar datos
        this.data.addPicture(this.pictureObject);
        // Limpiar datos
        this.title = '';
        this.series = '';
        this.category =  []; 
        this.price = 0;
        this.materials = '';
      });
      this.ngOnInit();
    })
    ).subscribe( (res : any) =>{
      this.percentage = (res.bytesTransferred * 100 / res.totalBytes);
    }, err =>{
      console.log(err);
    });  
  }

  deletePicture(picture : Picture){
    if(window.confirm('Are you sure you want to delete the picture')){
      this.data.deletePicture(picture);
    }
  }

  selectedFile(event:any){
    this.selectedFiles = event.target.files;
  }

} 
