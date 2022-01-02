import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


export default function OutlinedCard(props) {
    const{title, data} = props;
  return (
    <Box sx={{ minWidth: 400, margin: 2, minHeight: 300 }}>
      <Card variant="outlined">{<React.Fragment>
        <CardContent>
          <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {data && data.length > 0 && data.map((d, key) => {
            if(d.value){
              return (<div id={key} key={d.label}>
                <Typography variant="h9" component="div">
                {d.label}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {d.value}
              </Typography></div>)
            }
            return null
          }
          )}
          
        </CardContent>
      </React.Fragment>}</Card>
    </Box>
  );
}
