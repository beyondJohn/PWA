import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSettingsComponent } from './share-settings.component';

describe('ShareSettingsComponent', () => {
  let component: ShareSettingsComponent;
  let fixture: ComponentFixture<ShareSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
