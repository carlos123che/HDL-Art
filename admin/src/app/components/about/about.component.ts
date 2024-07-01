import { Component } from '@angular/core';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { About } from 'src/app/model/About';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  description: string = '';
  percentage: number = 0;
  
  
  // File attributes  
  selectedFiles !:FileList;
  currentFileUpload !: FileMetaData;

  about: About[] = []

  constructor(   private data : DataService, 
                 private fireStorage : AngularFireStorage,
                 private router: Router, ){}


  ngOnInit(){
    this.getAbout();
  }

  selectedFile(event:any){
    this.selectedFiles = event.target.files;
  }

  getAbout(){
    this.data.getAbout().subscribe( (res:any) => {
      this.about = res.map( (e:any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching the data');
    });
  }

  editAbout(){
    if (this.selectedFiles){

      console.log("File Uploaded");
      // Cargar Photo nueva
      this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
      const path = 'about/' + this.currentFileUpload.file.name;
      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(this.selectedFiles[0]);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((downloadLink) => {
              this.currentFileUpload.id = '';
              this.currentFileUpload.url = downloadLink;
              this.currentFileUpload.size = this.currentFileUpload.file.size;
              this.currentFileUpload.name = this.currentFileUpload.file.name;
              // Settear URL
              // Change URL
              this.about[0].url = downloadLink;
              this.data.updateAbout(this.about[0]);
              this.router.navigate(['/about']);
            });
          })
        )
        .subscribe(
          (res: any) => {
            this.percentage = (res.bytesTransferred * 100) / res.totalBytes;
          },
          (err) => {
            console.log(err);
          }
        ).add( () => this.percentage = 0);
    }
    else{
      this.data.updateAbout(this.about[0]);
    }
    
  }


}
