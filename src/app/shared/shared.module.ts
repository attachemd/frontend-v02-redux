import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, FlexLayoutModule, MaterialModule],
    exports: [CommonModule, FormsModule, FlexLayoutModule, MaterialModule],
})
export class SharedModule {}
