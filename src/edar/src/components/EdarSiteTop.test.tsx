import { EdarSiteTop } from './EdarSiteTop';
import { render } from '@testing-library/react';

test('EdarSiteTop: 適切なtitleが取得できるかどうか', () => {
  const container = render(<EdarSiteTop />);
  expect(container.getByTitle('food image')).toBeInTheDocument();
});
