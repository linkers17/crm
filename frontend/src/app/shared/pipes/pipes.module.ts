import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StagePipe} from "./stage.pipe";



@NgModule({
  declarations: [StagePipe],
  imports: [
    CommonModule
  ],
  exports: [
    StagePipe
  ]
})
export class PipesModule { }
