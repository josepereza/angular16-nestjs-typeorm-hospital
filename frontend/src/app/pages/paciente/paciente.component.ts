import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/services/paciente.service';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Doctores } from 'src/app/interfaces/doctores';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
})
export class PacienteComponent {
  array:Object[]=[]
  patient$!: Observable<any>;
 
  patient: any;
  midoctors: any[] = [];
  hospitales:any[]=[];
  pacienteId: any;
  formDoctores = new FormControl([], { nonNullable: true });
  formHospital = new FormControl([], { nonNullable: true });
  formPatient = this.fb.group({
    name:[''],
    surname:[''],
    dni:['']
  })
  constructor(
    private pacienteSevice: PacienteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}
  ngOnInit() {
    this.pacienteSevice.getAllDoctors().subscribe((data: any) => {
      this.midoctors = data;
    });
    this.pacienteSevice.getAllHospital().subscribe((data:any)=>{
  this.hospitales=data
    })
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    console.log(this.pacienteId);
    this.patient$ = this.pacienteSevice.getOne(this.pacienteId);
    this.patient$.subscribe((data) => {
      console.log(data);
      this.patient = data;
      this.formPatient.setValue({
        name:this.patient.name,
        surname:this.patient.surname,
        dni:this.patient.dni
      })
    });

   
  }
  enviarDoctores() {
  
    console.log('formdoctoes.value', this.formDoctores.value);
    this.formDoctores.value.forEach(doctorId => {
      console.log('doctorId',doctorId)
     //const miobjeto2 = {id:element}
     
     this.array.push({id:doctorId})
     
    });

    console.log('miobjeto ', this.array)
    this.pacienteSevice
      .actualizaDoctors(this.pacienteId, this.array)
      .subscribe((data) => {
        this.patient$ = this.pacienteSevice.getOne(this.pacienteId);
    this.patient$.subscribe((data) => {
      console.log(data);
      this.patient = data;
    });
      });
  }
  enviarHospital(){
    const objeto={hospital:{id: this.formHospital.value}}
    console.log('en enviar hospital',objeto)
    const id=this.formHospital.value
    this.pacienteSevice.actualizaHospital(this.pacienteId,objeto).subscribe(data=>{
      this.patient$ = this.pacienteSevice.getOne(this.pacienteId);
    this.patient$.subscribe((data) => {
      console.log('despues de envio de hospital',data);
      this.patient = data;
    });
    })
  }
  enviarPatient(){
    this.pacienteSevice.actualizaHospital(this.pacienteId,this.formPatient.value).subscribe(data=>{
      this.patient$ = this.pacienteSevice.getOne(this.pacienteId);
    this.patient$.subscribe((data) => {
      console.log(data);
      this.patient = data;
    });
    })
  }

  
  
}
