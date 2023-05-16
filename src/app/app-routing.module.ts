import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    DragDropModule
  ],
  exports: 
    [RouterModule
  ]
})
export class AppRoutingModule { }
