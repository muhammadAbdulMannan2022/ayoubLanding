import React from 'react';
import { Button, Icon, Box } from '@adminjs/design-system';

const DownloadButton = (props) => {
  const { record, property } = props;
  const value = record.params[property.name];

  if (!value) {
    return <Box>-</Box>;
  }

  return (
    <Button
      as="a"
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      size="sm"
      variant="primary"
    >
      <Icon icon="Download" />
      Download
    </Button>
  );
};

export default DownloadButton;
