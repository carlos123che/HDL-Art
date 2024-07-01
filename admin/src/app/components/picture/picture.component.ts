import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Picture } from 'src/app/model/Picture';
import { DataService } from 'src/app/shared/data.service';
import { Category } from 'src/app/model/Category';
import { FileMetaData } from 'src/app/model/file-meta-data';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css'],
})
export class PictureComponent {
  pictureId: string | null = null;

  picture: any = {
    id: '',
    title: '',
    materials: '',
    price: 0,
    series: '',
    category: [],
    url: '',
    description: ''
  };

  title: string = '';
  series: string = '';
  price: number = 0;
  materials: string = '';
  category: string[] = [];
  description: string = '';


  /* -- Cateogires -- */
  categoryList: Category[] = [];

  // Items for a new photo
  selectedFiles!: FileList;
  currentFileUpload!: FileMetaData;
  percentage: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getAllCategories();

    this.route.paramMap.subscribe((params) => {
      this.pictureId = params.get('id');
      if (this.pictureId) {
        this.getPicture(this.pictureId);
      }
    });
  }

  getPicture(id: string) {
    this.dataService.getPictureById(id).subscribe(
      (res) => {
        if (res) {
          this.picture = res as Picture;

          // Set properties
          this.title = this.picture.title;
          this.price = this.picture.price;
          this.series = this.picture.series;
          this.materials = this.picture.materials;
          this.description = this.picture.description;
        }
      },
      (err) => {
        alert('Error fetching data');
      }
    );
  }

  getAllCategories() {
    this.dataService.getAllCategories().subscribe(
      (res) => {
        this.categoryList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        alert('Error while fetching the data');
      }
    );
  }

  selectedFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  editPicture() {
    if (this.selectedFiles) {
      // Cargar Photo nueva
      this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
      const path = 'Uploads/' + this.currentFileUpload.file.name;
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
              this.picture.url = downloadLink;

              this.picture.id = this.pictureId;
              this.picture.title = this.title;
              this.picture.series = this.series;
              this.picture.materials = this.materials;
              this.picture.price = this.price;
              this.picture.description = this.description;

              // Settear categoria
              if (this.category.length > 0) {
                this.picture.category = this.category;
              }
  
              this.dataService.updatePicture(this.picture);
              this.router.navigate(['/dashboard']);
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
        );
    } else {
      this.picture.id = this.pictureId;
      this.picture.title = this.title;
      this.picture.series = this.series;
      this.picture.materials = this.materials;
      this.picture.price = this.price;
      this.picture.description = this.description;

      // Settear categoria
      if (this.category.length > 0) {
        this.picture.category = this.category;
      }

      this.dataService.updatePicture(this.picture);
      this.router.navigate(['/dashboard']);
    }
  }
}
