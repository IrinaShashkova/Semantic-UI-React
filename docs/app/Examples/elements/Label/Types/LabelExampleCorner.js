import React from 'react'
import { Grid, Image } from 'stardust'

const LabelExampleCorner = () => (
  <Grid columns={2}>
    <Grid.Column>
      <Image
        fluid
        label={{ as: 'a', corner: 'left', icon: 'heart' }}
        src='http://semantic-ui.com/images/wireframe/image.png'
      />
    </Grid.Column>

    <Grid.Column>
      <Image
        fluid
        label={{ as: 'a', color: 'red', corner: 'right', icon: 'save' }}
        src='http://semantic-ui.com/images/wireframe/image.png'
      />
    </Grid.Column>
  </Grid>
)

export default LabelExampleCorner
