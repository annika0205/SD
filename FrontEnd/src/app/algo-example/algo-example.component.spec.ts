import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoExampleComponent } from './algo-example.component';

describe('AlgoExampleComponent', () => {
  let component: AlgoExampleComponent;
  let fixture: ComponentFixture<AlgoExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlgoExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgoExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
