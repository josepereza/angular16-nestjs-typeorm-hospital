import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { In } from 'typeorm';

@Injectable()
export class PatientService {
  doctorObjet = {};
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async seedPatient() {
    const newDoctor1 = this.doctorRepository.create();
    const newDoctor2 = this.doctorRepository.create();
    newDoctor1.name = 'Isidro2';
    newDoctor2.name = 'Juanjo';
    await this.doctorRepository.save(newDoctor1);
    await this.doctorRepository.save(newDoctor2);

    const newHospital1 = this.hospitalRepository.create();
    const newHospital2 = this.hospitalRepository.create();
    newHospital1.name = 'Arrixaca';
    newHospital1.city = 'Murcia';
    newHospital2.name = 'Virgen Del Carmen';
    newHospital2.city = 'Alicante';
    await this.hospitalRepository.save(newHospital1);
    await this.hospitalRepository.save(newHospital2);

    const newPatient = this.patientRepository.create();
    newPatient.doctors = [newDoctor1, newDoctor2];
    newPatient.dni = '247247242';
    newPatient.name = 'jose';
    newPatient.surname = 'perez';
    newPatient.hospital = newHospital1;
    await this.patientRepository.save(newPatient);

    const newPatient2 = this.patientRepository.create();
    newPatient2.doctors = [newDoctor2];
    newPatient2.dni = '247247242';
    newPatient2.name = 'santi';
    newPatient2.surname = 'sepulveda';
    newPatient2.hospital = newHospital2;
    await this.patientRepository.save(newPatient2);
    return '2 registros agregados';
  }

  async create(createPatientDto: CreatePatientDto) {
    const { name, surname, dni, doctors, hospitalId } = createPatientDto;
    const hospital = await this.hospitalRepository.findOne({
      where: { id: createPatientDto.hospitalId },
    });

    const doctores = await this.doctorRepository.findBy({
      id: In(doctors),
    });
    const newPatient = this.patientRepository.create({
      name,
      surname,
      dni,
      hospital,
      doctors: doctores,
    });
    return this.patientRepository.save(newPatient);
  }

  findAll() {
    return this.patientRepository.find({
      relations: {
        doctors: true,
        hospital: true,
      },
    });
  }

  findOne(id: number) {
    return this.patientRepository.findOne({
      where: {
        id,
      },
      relations: {
        doctors: true,
        hospital: true,
      },
    });
  }

  //actualiza el paciente
  async updatePaciente(id: number, updatePatientDto: any) {
    console.log('actualiza paciente ',updatePatientDto)
    const { name, surname, dni, hospitalId } = updatePatientDto;
    const mihospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    const paciente = await this.patientRepository.findOne({
      where: { id },
     
    });
    console.log('mihospital/paciente', mihospital,paciente)
    paciente.name = name;
    paciente.surname = surname;
    paciente.dni = dni;
    paciente.hospital=mihospital;
    
    return this.patientRepository.update({ id }, paciente);
  }
  //actualiza el hospital
  async update(id: number, updatePatientDto: number) {
    console.log('actualiza hospital',updatePatientDto)
   
    const mihospital = await this.hospitalRepository.findOne({
      where: { id: updatePatientDto },
    });
    const paciente = await this.patientRepository.findOne({
      where: { id },
      relations: { doctors: true, hospital: true },
    });
   
   
   paciente.hospital = mihospital;
    return this.patientRepository.save(paciente);
  }

  // Aqui actualizamos los doctores de un paciente
  async updateDoctors(id: number, body: any) {
    console.log('mi body', body);
    const doctorIds = body;
    const doctores = await this.doctorRepository.findBy({ id: In(doctorIds) });

    const paciente = await this.patientRepository.findOne({
      where: { id },
      relations: { doctors: true, hospital: true },
    });

    paciente.doctors = doctores;

    return await this.patientRepository.save(paciente);
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }

  // Asigna un doctor y devuelve los datos del paciente

  async assignDoctor(patient_id, doctor_id) {
    console.log(patient_id, doctor_id);
    const paciente = await this.patientRepository.findOne({
      where: { id: patient_id },
      relations: { doctors: true },
    });
    console.log(paciente.name);
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctor_id.doctorId },
    });
    console.log('patient-doctor', doctor.name);
    paciente.doctors.push(doctor);
    if (paciente && doctor) {
      return await this.patientRepository.save(paciente);
    }
    throw new HttpException('Registros no encontrados', HttpStatus.NOT_FOUND);
  }
  async buscardoctores(body) {
    const doctorIds = body.doctorIds;
    return await this.doctorRepository.findBy({ id: In(doctorIds) });
  }
}
