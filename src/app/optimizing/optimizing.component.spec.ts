import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizingComponent } from './optimizing.component';

describe('OptimizingComponent', () => {
  let component: OptimizingComponent;
  let fixture: ComponentFixture<OptimizingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptimizingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptimizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
