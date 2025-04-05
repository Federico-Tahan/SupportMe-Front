import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaingComponent } from './campaing.component';

describe('CampaingComponent', () => {
  let component: CampaingComponent;
  let fixture: ComponentFixture<CampaingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
