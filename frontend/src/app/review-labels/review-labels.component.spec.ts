import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewLabelsComponent } from './review-labels.component';

describe('ReviewLabelsComponent', () => {
  let component: ReviewLabelsComponent;
  let fixture: ComponentFixture<ReviewLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
