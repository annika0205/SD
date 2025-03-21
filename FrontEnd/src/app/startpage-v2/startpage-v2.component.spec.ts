import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartpageV2Component } from './startpage-v2.component';

describe('StartpageV2Component', () => {
  let component: StartpageV2Component;
  let fixture: ComponentFixture<StartpageV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartpageV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartpageV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
