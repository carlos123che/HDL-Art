import { Component,  ViewChild, ElementRef } from '@angular/core';
import { New } from 'src/app/model/New';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent {
  // Campos para imagen
  selectedFiles!: FileList;
  currentFileUpload!: FileMetaData;
  percentage: number = 0;

  listOfFiles: FileMetaData[] = [];

  // Manejar tipos
  showImageInput: boolean = false;
  showLinkInput: boolean = false;

  // New Attributes
  type: string = '';
  title: string = '';
  description: string = '';
  link: string = '';

  newsObject: New = {
    id: '',
    title: '',
    description: '',
    type: '',
    link: '',
    url: '',
  };

  
  newsList: New[] = []

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private data: DataService,
    private fireStorage: AngularFireStorage
  ) {}
  
  ngOnInit(): void{
    this.getAllNews();
  }

  getAllNews(){
    this.data.getAllNews().subscribe( (res:any) => {
      this.newsList = res.map( (e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching the data');
    });
  }


  onOptionChange(option: string): void {
    this.showImageInput = option === 'Image' || option === 'Both';
    this.showLinkInput = option === 'Link' || option === 'Both';
  }

  saveNew() {
    var dataIsNotEmpty = this.validateEmptyData();
    // Si no hay campos vacios
    if( dataIsNotEmpty == true)
    {
      this.newsObject.id = '';
      this.newsObject.title = this.title;
      this.newsObject.type = this.type;
      this.newsObject.description = this.description;
      this.newsObject.link = this.link;
      
      // Si es link settear imagen nula
      if(this.type == "Link"){
        this.newsObject.url = '';
        // Guardar datos News
        this.data.addNew(this.newsObject);
        // Limpiar Datos
        this.clearForm();
        // Cargar news
        this.ngOnInit();
      }
      
      // Si es imagen guardar imagen y settear url al objeto
      if(this.type == "Image" || this.type == "Both"){
       
        this.currentFileUpload = new FileMetaData( this.selectedFiles[0]);

        const path = 'News/' + this.currentFileUpload.file.name;
        const storageRef = this.fireStorage.ref(path);
        const uploadTask = storageRef.put(this.selectedFiles[0]);


        uploadTask.snapshotChanges().pipe( finalize( () => {
          storageRef.getDownloadURL().subscribe( downloadLink => {
            this.currentFileUpload.id = '';
            this.currentFileUpload.url = downloadLink;
            this.currentFileUpload.size = this.currentFileUpload.file.size;
            this.currentFileUpload.name = this.currentFileUpload.file.name;
            // Settear URL
            this.newsObject.url =  downloadLink;
            // Guardar datos
            this.data.addNew(this.newsObject);
            // Limpiar datos
            this.clearForm();
          });
          this.ngOnInit();
        })
        ).subscribe( (res : any) =>{
          this.percentage = (res.bytesTransferred * 100 / res.totalBytes);
        }, err =>{
          console.log(err);
        });  

      }
      

    }
  }
  

  validateEmptyData(){
    // Validar que los campos no esten vacios
    if (this.title == '' || this.description == '' || this.type == '')
      {
        alert('Fill all fields!');
        return false;
      } 
      else 
      {
        // Si es de tipo link validar que el link no sea nulo
        if (this.type == 'Link') 
        {
          if( this.link == '')
          {
            alert('Fill Link!');
            return false;
          }
          else
          {
            return true;
          }
        } // Si es de tipo imagen
        else if (this.type == 'Image') 
        {
          // Validar que la imagen no sea nula
          if (!this.selectedFiles || this.selectedFiles.length === 0) 
          {
            alert('Select an Image');
            return false;
          }
          else
          {
            return true;
          }
        }// Si tiene imagen y link 
        else if( this.type == 'Both')
        {
          if( !this.selectedFiles || this.selectedFiles.length === 0 || this.link == '')
          {
            alert("Set link and select and image!");
            return false;
          }else
          {
            return true;
          }
        }
        else{
          return false;
        }
      }
  }


  clearForm(){
    this.title = '';
    this.type = '';
    this.description = '';
    this.link = '';
    this.percentage = 0;
    this.fileInput.nativeElement.value = ''; // Limpiar el input de archivo
  }

  // seleccionar imagen
  selectedFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  deleteNew(news:New){
    if(window.confirm('Are you sure you want to delete the new')){
      this.data.deleteNew(news);
    }
  }
}
