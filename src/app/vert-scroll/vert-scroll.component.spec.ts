import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertScrollComponent } from './vert-scroll.component';

describe('VertScrollComponent', () => {
  let component: VertScrollComponent;
  let fixture: ComponentFixture<VertScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
