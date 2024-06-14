import { Component, ViewChild } from '@angular/core';
import { StudentService } from '../Services/studentService';
import { StudentDto } from '../Dto/StudentDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  students: StudentDto[] = [];
  addStudentModal: boolean = false;
  date: Date | undefined = new Date();

  editClicked: boolean = false;
  detailsView: boolean = false;

  addStudentForm = this.fb.group({
    id: [''],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateofbirth: [this.date, Validators.required],
    mobile: ['', Validators.required],
    nic: ['', Validators.required],
    imageurl: ['', Validators.required],
    address: ['', Validators.required]

  })
  currentEditImageUrl: string = '';
  currentEditId: number = 0;

  mainTableViewCss!: string;

  selectedStudent!: StudentDto;

  constructor(public studentService: StudentService, public fb: FormBuilder, private messageService: MessageService,
    private confirmationService: ConfirmationService) {

  }

 



  ngOnInit(): void {

    this.loadStudentDetails();

  }


  loadStudentDetails() {
    this.studentService.GetStudentDetails().subscribe(result => {

      if (result) {
        this.students = result;
      }

    });
  }

  openAddStudent() {
    this.editClicked = false;
    this.addStudentModal = true;
    this.addStudentForm.reset();
  }


  addNewStudent() {

    this.studentService.AddStudentRecord("INSERT", this.addStudentForm.value).subscribe(result => {
      if (result == 'Inserted successfully') {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Record Created', life: 3000 });
        this.addStudentModal = false;
        this.addStudentForm.reset();
        this.loadStudentDetails();
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Unsuccessful', detail: 'Student already exists', life: 3000 });
      }
    });
  }

  updateStudent(){

    this.addStudentForm.get('id')?.patchValue(this.currentEditId.toString());

    this.studentService.UpdateStudentRecord("UPDATE", this.addStudentForm.value).subscribe(result => {
      if(result == 'Updated successfully')
        {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Record Updated', life: 3000 });
          this.addStudentModal = false;
          this.editClicked = false;
          this.currentEditImageUrl = '';
          this.currentEditId = 0;
          this.detailsView = false;
          this.mainTableViewCss = 'col-lg-12 shadow-sm';
          this.addStudentForm.reset();
          this.loadStudentDetails();
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Unsuccessful', detail: 'Email or name already exists', life: 3000 });
        }
    })

  }


  deleteStudent(student: StudentDto) {
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + student.firstName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.studentService.RemoveStudent("DELETE", student.id).subscribe(result => {
          if (result == 'Deleted successfully') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
            this.loadStudentDetails();
            this.detailsView = false;
            this.mainTableViewCss = 'col-lg-12 shadow-sm';
          }
        });


      }
    });

  }

  editStudent(student: StudentDto){
    this.editClicked = true;
    this.addStudentModal = true;

    this.currentEditImageUrl = student.imageUrl;
    this.currentEditId =  student.id;

    this.date = new Date(student.dateOfBirth);
    

    // Patching the form with the values of the selected student
    this.addStudentForm.patchValue({
      firstname: student.firstName,
      lastname: student.lastName,
      email: student.email,
      dateofbirth:  new Date(student.dateOfBirth),
      mobile: student.mobile,
      nic: student.nic,
      imageurl: student.imageUrl,
      address: student.address
  });

  console.log(this.addStudentForm.value);
  
  }

  onRowSelect(event: any) {
    this.mainTableViewCss = 'col-lg-8 shadow-sm';
    this.detailsView = true;
    this.selectedStudent = event.data
  }

  onRowUnselect(event: any) {
      this.detailsView = false
      this.mainTableViewCss = 'col-lg-12 shadow-sm';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

  

}
