import { Component } from '@angular/core';
import { Category } from 'src/app/model/Category';
import { DataService } from 'src/app/shared/data.service';

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
    description: ''
  }

  constructor(private dataService: DataService){}


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
    if(this.category == ''){
      alert('Fill all fields.');
    }
    

    // Set category object properties
    this.categoryObject.id = '';
    this.categoryObject.category =  this.category;
    this.categoryObject.description = this.description;

    // Save data
    this.dataService.addCategory(this.categoryObject);

    // Clean Form
    this.resetForm();
  }

  // Clean Form
  resetForm(){
    this.category = '';
    this.description = '';
  }


  // Delete Category
  deleteCategory(category : Category){
    if(window.confirm('Are you sure you want to delete the category')){
      this.dataService.deleteCategory(category);
    }
  }

  




}
