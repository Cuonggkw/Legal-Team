import React from "react";
import Avatar from '@mui/material/Avatar';
import { Box, Button, Divider, FormControl, Grid, MenuItem, Pagination, Paper, Stack, TextField } from "@mui/material";
import { Select, TextareaAutosize } from "@material-ui/core";
import moment from "moment";
import { Textarea } from "@mui/joy";

const imgLink = '/images/images.png'
class CardFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      module: this.props.module,
      values:[],
      content:'',
      page:1,
      limit:5,
      total:0
    }
  }
  componentDidMount(){
    this.props.getData(`limit=${this.state.limit}&offset=0`).then(res=>this.setState({values:res.data,total:res?.total}));
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.page !== this.state.page || prevState.limit !== this.state.limit)
      this.props.getData(`limit=${this.state.limit}&offset=${(this.state.page-1)*this.state.limit}`).then(res=>this.setState({values:res.data,total:res?.total}));

  }
  handlePagination = async (e, page) => {
    this.setState({ page: page });
  };
 
  render() {
    return (
      <React.Fragment>
        <div style={{ padding: 14 }} className="App">
      <h1>Bình luận</h1>
      {this.props.authen ? <Paper style={{ padding: "20px 20px" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={imgLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <Textarea minRows={4} style={{width:'100%'}} onChange={(e)=>this.setState({...this.state,content:e.target.value})} value={this.state.content}/>
            <Button
							className="btn"
							variant="contained"
							onClick={async()=>{
                if(this.state.content.trim()){
                  const res = await this.props.handleComment(this.state.content);
                  if(res)
                    this.props.getData(`limit=${this.state.limit}&offset=0`).then(res=>this.setState({values:res.data,content:''}));
                }
              }}
              disabled={!this.state.content.trim()}
              style={{marginTop:10}}
						>
							Bình luận
						</Button>
          </Grid>
        </Grid>
      </Paper>:<Paper style={{ padding: "20px 20px"}}><Button
							className="btn"
							variant="contained"
							onClick={this.props.returnlogin}
              style={{margin:'auto'}}
						>
							Đăng nhập
						</Button></Paper>}
      {this.state.values?.map( value => <Paper style={{ padding: "20px 20px" }} key={value.id}>
        <Grid container wrap="nowrap" spacing={2} >
          <Grid item>
            <Avatar alt="Remy Sharp" src={value?.avatar ?? imgLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>{value?.user_fullname}</h4>
            <p style={{ textAlign: "left" }}>
              {value.content}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              {moment(value.created_at).format('DD-MM-YYYY HH:mm:SS')}
            </p>
          </Grid>
        </Grid>
      </Paper>)}
          {this.state.values?.length > 0 && (
            <div className="card-footer">
              <div className="d-flex justify-content-between wp-100">
                <div className="listBox">
                  <Box sx={{ minWidth: 75 }}>
                    <FormControl
                      fullWidth
                      className="selectCustom bgGray"
                    >
                      <Select
                        id="limit-select"
                        name='name'
                        value={this.state.limit}
                        onChange={(e)=> this.setState({ limit: e.target.value })}
                      >
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>

                {this.state.total > this.state.limit && (
                  <Stack spacing={2} className="pagination">
                    <Pagination
                      count={
                        Math.ceil(this.state.total / this.state.limit) >
                          Math.ceil(10000 / this.state.limit)
                          ? Math.ceil(10000 / this.state.limit)
                          : Math.ceil(this.state.total / this.state.limit)
                      }
                      shape="rounded"
                      onChange={this.handlePagination}
                      page={this.state.page}
                    />
                  </Stack>
                )}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default CardFooter;
