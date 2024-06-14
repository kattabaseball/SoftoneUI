import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentDto } from "../Dto/StudentDto";
import { AddStudentDto } from "../Dto/AddStudentDto";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class StudentService {
    BASEURL: string = environment.BASEURL;
    

    constructor(private http: HttpClient) {
        
    }


    GetStudentDetails() : Observable<StudentDto[]>{
        return this.http.get<StudentDto[]>(this.BASEURL + "Student/GetStudentDetails");
    }

    AddStudentRecord(spType: string, addStudent: any) : Observable<string>
    {

        let myparams = new HttpParams()
        .set('spType', spType);

        return this.http.post<string>( this.BASEURL + "Student/AddStudent", addStudent, { params: myparams });
    }

    UpdateStudentRecord(spType: string, student: any){
        let myparams = new HttpParams()
        .set('spType', spType);

        return this.http.post<string>(this.BASEURL + "Student/UpdateStudent", student, { params: myparams });
    }


    RemoveStudent(spType:string, id: number) : Observable<string>
    {
        let myparams = new HttpParams()
        .set('spType', spType)
        .set('id', id);

        return this.http.delete<string>( this.BASEURL + "Student/RemoveStudent", { params: myparams });
    }







}