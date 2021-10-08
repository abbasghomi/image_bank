import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelingPolygonComponent } from './labeling-polygon.component';

describe('LabelingPolygonComponent', () => {
  let component: LabelingPolygonComponent;
  let fixture: ComponentFixture<LabelingPolygonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelingPolygonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelingPolygonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
