import { Component } from '@angular/core';
import { Category } from 'src/app/model/Category';
import { DataService } from 'src/app/shared/data.service';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})


export class CategoriesComponent {
  
  // Category List
  categoryList: Category[] = [];

  // Category Form Attributes
  category: string = '';
  description: string = '';

  // Category Object
  categoryObject: Category = {
    id : '',
    category: '',
    description: '',
    url : '',
  }



  // File attributes  
  selectedFiles !:FileList;
  currentFileUpload !: FileMetaData;
  percentage : number = 0;

  constructor(private dataService: DataService, private fireStorage : AngularFireStorage){}


  ngOnInit(): void{
    this.getAllCategories();
  }


  // Get all categories
  getAllCategories(){
    this.dataService.getAllCategories().subscribe( res => {
      this.categoryList = res.map( (e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching the data');
    });
  }
  
  // Add a new Category
  addCategory(){
    // Validar que los campos requeridos no esten vacios
    if( this.category == '' || 
        this.description == '' || 
        !this.selectedFiles || 
        this.selectedFiles.length === 0 )
    {
      alert('Fill all fields.');
    }
  
    // Set category object properties
    this.categoryObject.id = '';
    this.categoryObject.category =  this.category;
    this.categoryObject.description = this.description;
    
    // Upload File
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
        this.categoryObject.url =  downloadLink;

        // Save data
        this.dataService.addCategory(this.categoryObject);
        // Clean Form
        this.resetForm();
      });
      this.ngOnInit();
    })
    ).subscribe( (res : any) =>{
      this.percentage = (res.bytesTransferred * 100 / res.totalBytes);
    }, err =>{
      console.log(err);
    }); 

  }

  // Clean Form
  resetForm(){
    this.category = '';
    this.description = '';
    this.percentage = 0;
  }


  // Delete Category
  deleteCategory(category : Category){
    if(window.confirm('Are you sure you want to delete the category')){
      this.dataService.deleteCategory(category);
    }
  }

  
  selectedFile(event:any){
    this.selectedFiles = event.target.files;
  }




}
