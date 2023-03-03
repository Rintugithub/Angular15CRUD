import { User } from './../models/user.model';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ["Monthly","Quarterly","Yearly"];
  public genders: string[] = ["Male","Female"];

  public importantlist: string[] =[
    "Toxic Fat reduction",
    "Enery And Endurance",
    "Building Lean Muscle",
    "Fitness",
    "Sugar Craving Body",
    "Helthier Digestive System",]
    public registerForm!:FormGroup;
    public userUid!:number;
    public isUpdateActive: boolean = false;
    constructor(private fb:FormBuilder, private api:ApiService, private toast:NgToastService, private active:ActivatedRoute, private router:Router){

    }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });
   this.registerForm.controls['height'].valueChanges.subscribe(res=>{
    this.calculateBmi(res);
   });
   this.active.params.subscribe(val=>{
    this.userUid = val['id'];
    this.api.getRegistredUserId(this.userUid).subscribe(res=>{
      this.isUpdateActive = true;
      this.fillFormToUpdate(res);
    })
   })
  }

  submit(){
    console.log(this.registerForm.value);
   this.api.postRegistration(this.registerForm.value).subscribe(res=>{
   this.toast.success({detail:"SUCCESS", summary:"Enquiry Added" , duration:3000});
   this.registerForm.reset();
   })

  }
  update(){
    console.log(this.registerForm.value);
    this.api.updateRegistration(this.registerForm.value, this.userUid).subscribe(res=>{
    this.toast.success({detail:"SUCCESS", summary:"Enquiry Updated" , duration:3000});
    this.registerForm.reset();
     this.router.navigate(['list']);
    })

  }
  calculateBmi(heightValue:number){
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi< 18.5:
        this.registerForm.controls['bmiResult'].patchValue("Underweight");
        break;
        case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
        break;
        case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");

        break;
    };

  }
  fillFormToUpdate(user: User){
   this.registerForm.setValue({
    firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  mobile: user.mobile,
  weight: user.weight,
  height: user.height,
  bmi: user.bmi,
  bmiResult: user.bmiResult,
  gender: user.gender,
  requireTrainer:user.requireTrainer,
  package: user.package,
  important: user.important,
  haveGymBefore: user.haveGymBefore,
  enquiryDate: user.enquiryDate
   })
  }


}
