import {
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "styled-components";

function Token({ className }) {
  const list = [
    {
      addr: "123",
      token: 1000.23,
    },
    {
      addr: "456",
      token: 1000.23,
    },
  ];
  return (
    <Stack className={className}>
      <Stack>
        <h2>Tokenomics</h2>
        <label>
          Tokens are the key to a circular economy. Contributing resources is
          rewarded with tokens that developers can use to purchase the desired
          resources to
          <br />
          train their models. Of course, you also earn tokens when the resources
          you contribute are used by others.
        </label>
        <Stack direction="row" spacing={5}>
          <Grid container spacing={5}>
            <Grid item md={4}>
              <Stack>
                <Stack direction="row">
                  <span>50000</span>
                  <label>DIST</label>
                </Stack>
                <label>Total output</label>
              </Stack>
            </Grid>
            <Grid item md={4}>
              <Stack>
                <span>499.44</span>
                <label>My rewards</label>
              </Stack>
            </Grid>
            <Grid item md={4}>
              <Stack>
                <span>499.4</span>
                <label>My unclaimed rewards</label>
                <Button className="cbtn">Claim All</Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item md={4}>
              <Stack>
                <Stack direction="row">
                  <span>499.44</span>
                  <label>DIST</label>
                </Stack>
                <label>Total circulation</label>
              </Stack>
            </Grid>
            <Grid item md={4}>
              <Stack>
                <span>499.44</span>
                <label>My earnings</label>
              </Stack>
            </Grid>
            <Grid item md={4}>
              <Stack>
                <span>342</span>
                <label>My locked earnings</label>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      <Stack direction="row">
        <div>
          <h2>The 3rd period</h2>
          <label>2024/06/06</label>
          <Stack direction="row">
            <div />
            <Stack>
              <span>
                <b>300</b> resources were shared
              </span>
              <span>
                <b>40000</b> DIST were found
              </span>
              <span>
                My rewards <b>400</b> DIST
              </span>
            </Stack>
          </Stack>
          <Stack direction="row">
            <div />
            <Stack>
              <span>
                <b>300</b> deals closed
              </span>
              <span>
                <b>1000</b> DIST were circulated
              </span>
              <span>
                My earnings <b>400</b> DIST
              </span>
            </Stack>
          </Stack>
        </div>
        <div>
          <h2>Top 100 tokens acquired</h2>
          <label>
            Show the top 100 people with the most tokens, and the data is
            updated daily
          </label>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ranking</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Tokens</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>NO.{index + 1}</TableCell>
                    <TableCell>{item.addr}</TableCell>
                    <TableCell>{item.token}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <h2>My Ranking</h2>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Unranked</TableCell>
                  <TableCell>cXfg2SYcq85nyZ1U4ccx6…hXY</TableCell>
                  <TableCell>1000.23</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Stack>
    </Stack>
  );
}
export default styled(Token)``;
