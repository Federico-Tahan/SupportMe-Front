import { Component } from '@angular/core';
import { CardCampaignComponent } from "../../../public/components/card-campaign/card-campaign.component";
import { HeaderFormComponent } from "../header-form/header-form.component";

@Component({
  selector: 'app-campaing',
  standalone: true,
  imports: [CardCampaignComponent, HeaderFormComponent],
  templateUrl: './campaing.component.html',
  styleUrl: './campaing.component.scss'
})
export class CampaingComponent {

}
