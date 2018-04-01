import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CalendarModule } from 'angular-calendar';
import { StudyPlanService } from './study-plan/study-plan.service';
import { ScheduleService } from './schedule/schedule.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuillEditorModule } from 'ngx-quill-editor';
import {
  NgbDatepickerModule,
  NgbTimepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import { StudyPlanListViewComponent } from './study-plan/study-plan-list-view/study-plan-list-view.component';



@NgModule({
  imports: [
    ScheduleRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    QuillEditorModule
  ],
  declarations: [ScheduleComponent, StudyPlanComponent, CalendarHeaderComponent, DateTimePickerComponent, StudyPlanListViewComponent],
  providers: [StudyPlanService, ScheduleService]
})
export class ScheduleModule { }
