import {NgModule} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FlexLayoutModule],
  exports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FlexLayoutModule]
})
export class MaterialModule {

}
