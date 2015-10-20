import React from 'react';
import {Item} from 'stardust';
import faker from 'faker';

describe('Item', () => {
  it('Item renders children', () => {
    let child = faker.hacker.phrase();
    render(<Item>{child}</Item>).findText(child);
  });
});
