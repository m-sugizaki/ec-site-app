import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MaterialModule } from './material.module'

const imp = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,

]

@NgModule({
  imports: imp,
  exports: [...imp],
})
export class SharedModule {}
