import React, { useState, useCallback, useEffect } from 'react';
import { useRootState } from '../../lib/hooks/useRootState';
import { inputRegex } from '../../lib/inputRegex';
import { useAppDispatch } from "../../store";
import { useDispatch } from 'react-redux';
import {
  asyncSaveSnapshotImage,
  asyncSaveSnapshotImages,
  deleteCoverImg,
  asyncGetWorktypeList,
  setIsActiveWorkTypeList,
  changeCustomWorkTypeList,
  changeTitle,
  deleteCustomWorkTypeList,
  changeDescription,
  changeSnapshotImgList,
  addSnapshotImg,
  deleteSnapshotImg,
  asyncAddSnapshot,
  changeCoverImg,
  initSnapshotList,
  changeEmail,
  initCustomWorkTypeList,
  asyncCheckStatusEmail,
  initCheckEmail

} from '../../modules/snapshot';


import { MenuItem } from '../../components/Menu';

import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Form,
    InputGroup, 
    Image,
    ListGroup,
    FloatingLabel 
} from "react-bootstrap";
import { 
    EditOutlined,
    CloseSquareOutlined,
    CloseCircleOutlined,
    PlusSquareOutlined 
} from '@ant-design/icons';
import { isEmpty } from '../../lib/util';
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


export const ChannelSnapshotAddContainer = () => {

  const {
    email,
    title,
    coverImg,
    description,
    workTypeList,
    customWorkTypeList,
    CUSTOM_CATE_CODE,
    snapShotImages,
    checkEmail
    
  } = useRootState((state) => state.snapshot);


  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
   dispatch(asyncGetWorktypeList());
   dispatch(changeTitle(''));
   dispatch(changeCoverImg(''));
   dispatch(initCustomWorkTypeList([]));
   dispatch(initSnapshotList([]));
   dispatch(changeEmail(''));
   dispatch(changeDescription(''));
   dispatch(initCheckEmail(false))
  }, []);

  const [customTagText, setCustomTagText] = useState<string>('');
  const [coverImgFile, setCoverImgFile] = useState<string>('');


  console.log("snapShotImages",snapShotImages)


//????????? ??????
  const setWorkTypeList = (index: number) => {
    dispatch(setIsActiveWorkTypeList(index));
  };

  const onAddCustomWorkTypeList = (text:string) =>{
    dispatch(changeCustomWorkTypeList(text))

  }
  const onDeleteCusotomWorkTypeList = (index:number) =>{
    dispatch(deleteCustomWorkTypeList(index))
  }

  const onDeleteProfileImg = () => {
    dispatch(deleteCoverImg(''));
  }
  
  const onDeleteSnapshotImgs = (index:number) => {
    dispatch(deleteSnapshotImg(index))
  }

  const onChange = (e:any) =>{
    const {id, value} = e.target
    switch (id) {
      case '??????':
        dispatch(changeTitle(value));
      break;
      case '????????????':
        setCustomTagText(value);
      break;
      case '??????':
        dispatch(changeDescription(value))
      break;
      case '?????????':
        dispatch(changeEmail(value))
      break;
    }
  }

  const handleChangeFile = (event:any) => {
    

    setCoverImgFile(event.target.files[0]);

    const reader:any = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    return new Promise((resolve:any) => { 
      reader.onload = () => { 
      dispatch(changeCoverImg(reader.result))
      resolve(); 
    }; });

    

  }

  const handleAddFiles = (event:any) => {


    // const reader:any = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);

    // return new Promise((resolve:any) => { 
    //   reader.onload = () => { 
    //   dispatch(addSnapshotImg({
    //     imagePath:reader.result,
    //     path:event.target.files[0]
    //   }))
    //   resolve(); 
    // }; });

    const files = event.target.files;

    for(let i = 0; i < files.length; i++) {
    
        const reader:any = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => { 
        dispatch(addSnapshotImg({
          imagePath:reader.result,
          path:files[i]
        }))
      }
    }


  }



  const onEdit = () => {
    if(!checkEmail){
      alert("?????? ????????? ??????????????????")
    }else if(isEmpty(title) ){
      alert("????????? ????????? ?????????");
    }else if(isEmpty(coverImg)){
      alert("?????? ???????????? ????????? ?????????");
    }else if(snapShotImages.length === 0){
      alert("????????? 1??? ?????? ????????? ?????????");
    }else if(isEmpty(getWorkTypeList())){
      alert("???????????? 1??? ?????? ??????????????????")
    }else{
       const formData = new FormData();
       formData.append('images', coverImgFile);
       formData.append('email', email);
       formData.append('type', 'coverImage');
  

       asyncSaveSnapshotImage(formData).then((payload:any) => {
        if(!payload)return;

          const SelectedcoverImg = payload[0];

          let orders:any = [];
          const formData = new FormData();
          for(var i in snapShotImages) {

            if(!snapShotImages[i].path) continue

            formData.append('images', snapShotImages[i].path);
            // formData.append('email', email);
            // formData.append('type', 'snapshotImages');

            orders.push(i)
          }
          formData.append('email', email);
          formData.append('type', 'snapshotImages');

          asyncSaveSnapshotImages(formData).then((payload:any) => {
            let paths = [];
            for(var i in payload){
              paths.push({imagePath: payload[i], imgOrder: Number(orders[i])})
            }

            asyncAddSnapshot({
                email:email,
                title:title,
                coverImg: SelectedcoverImg,
                description:description,
                snapshotList:paths,
                workTypeList:getWorkTypeList(),
                channelSnapshotTagList: getChannelSnapshotTagList()
            }).then(()=>{
              document.location.href = "/main/snapshot";
            })
          
   
          })
      
      })
      
    }
    
  }


  const getChannelSnapshotTagList = () => {

    const formattedText:any = [];
    const words = description.split(/(\s+)/);
    words.forEach((word, index) => {
      if(word.startsWith('#')){
        formattedText.push(word.replace('#',''))
      }
    })

    return formattedText;
  }

    const getWorkTypeList = () => {
    let list:any = [];
    workTypeList.map((e: any, i: number) => {
      if(e.isActive)
        list.push(e)
    })
    list = list.concat(customWorkTypeList)


    return list
  };

  const goBack = () =>{
    document.location.href = "/main/snapshot";
  }

  const onCheckStatusEmail = () => {
    if(isEmpty(email)){
      alert("?????? ???????????? ?????? ??? ?????????")

    }else {
      dispatch(asyncCheckStatusEmail({email})); 
    }
   
  }


  const onDragEnd = (result:any) => {
    // dropped outside the list(????????? ????????? ????????? ??????)
    if(!result.destination) return;
    const items = [...snapShotImages];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    dispatch(changeSnapshotImgList(items));
  }

  return (
    <Container style={{height:'5000px'}}>
      <MenuItem
        title='?????????'
        largeTitle='?????? ??????'
        middleTitle='?????????'
        smallTitle='??????'
      />
      <Container >
       <Form.Label >??? ?????? ??????</Form.Label>
        <Table variant="white" bordered >
          
          <tbody>
            <tr>
              <td>?????????</td>
              <td colSpan={3}>
              <InputGroup className="mb-3" >
                <Form.Control
                 type='text'
                  placeholder="?????? ??????"
                  value={email}
                  id="?????????"
                  onChange={onChange}
                />
                <Button 
                variant="outline-secondary" 
                id="button-addon2"
                onClick={onCheckStatusEmail}
                >
                  ????????? ??????
                </Button>
              </InputGroup>
              </td>
            </tr>
            <tr>
              <td>??????</td>
              <td colSpan={3}>
                <Form.Control
                   type='text'
                    placeholder="?????? ??????"
                    value={title}
                    id='??????'
                    onChange={onChange}
                />
              </td>
            </tr>
            <tr>
              <td>?????? ?????????</td>
              <td colSpan={3}>
                <div style={{width: '400px', height:'400px',position:'relative'}}>
                  {coverImg && coverImg ? (
                    <img 
                    src={coverImg}
                    //src={prevCoverImg}
                    className='img-thumbnail'
                    style={{ width: '100%', height:'100%' }}
                    />

                  ):(
                    <div style={{ width: '100%',height:'100%' , backgroundColor:'#fff', border:'1px solid #ddd', textAlign:'center' }}>
                      <p style={{marginTop:'100px'}}>????????? ??????</p>
                    </div>

                  )}
                  
                  <div style={{position:'absolute', background:'rgba(0, 0, 0, 0.5)', width:'100%',height:'90px', bottom:5}}>
                    <div style={{ textAlign:'center', marginTop:'30px'}}>
                      <a>
                      <label htmlFor="fileInput">
                        <EditOutlined style={{color:'#fff', fontSize:'25px'}}/>
                      </label>
                      <input type="file" id="fileInput" accept='image/*' onChange={handleChangeFile} style={{display:'none'}} />
                      </a>
                      <a onClick={onDeleteProfileImg} style={{marginLeft:8}}><CloseSquareOutlined style={{color:'#fff',fontSize:'25px'}} /></a>
  
                    </div>
                  </div>
                  
                </div>
                
              </td>
            </tr>
            <tr>
              <td>?????????</td>
              <td colSpan={3}>
                <div  style={{display:'flex'}}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="snapshots">
                      {(provided) => (
                        <div
                          className="snapshots"
                          {...provided.droppableProps}
                          ref={provided.innerRef} 
                          style={{display:'flex', listStyle:'none'}}
                        >
                          {snapShotImages?.map(({imagePath},index) => (
                            <Draggable key={`img-${index}`} draggableId={`img-${index}`} index={index}>
                            {(provided) => (
                              <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              //style={{width:'150px', height:'150px', position:'relative'}}
                              >
                              
                               <img
                                   src={imagePath}
                                   className='img-thumbnail'
                                   style={{ width:'150px', height:'150px'}}
                                />
                                 <a onClick={()=>onDeleteSnapshotImgs(index)} style={{marginRight:10, display:'block'}}><CloseSquareOutlined style={{color:'#070606',fontSize:'20px'}} /></a>
                              </div>
                            )}
                          </Draggable>
                   
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                </DragDropContext>
                <div
                    style={{width:'150px', height:'150px', position:'relative', textAlign:'center', border:'1px solid #ddd'}}>
                    <a>
                        <label htmlFor='addInputs'>
                          <PlusSquareOutlined style={{ fontSize:'40px', marginTop:'50px'}}/>
                        </label>
                        <input type="file" id='addInputs' multiple  accept='image/*' onChange={handleAddFiles}  style={{display:'none'}} />
                    </a>
                </div>
                </div>
              </td>
            </tr>
            {/* <tr>
                <td>?????????</td>
                <td colSpan={3}>
                     <div
                      style={{display:'flex'}}
                    >
                    {snapShotImages?.map((item, index)=>{
                    return(
                      <div
                      key={`snapshotList-${index}`}
                       style={{width:'150px', height:'150px', position:'relative'}}
                      >
                        <img
                           src={item.imagePath}
                           className='img-thumbnail'
                           style={{ width: '100%', height:'100%' }}
                        />
                         <div style={{position:'absolute', background:'rgba(0, 0, 0, 0.5)', width:'100%',height:'50px', bottom:1}}>
                          <div style={{ textAlign:'center', marginTop:'10px'}}>
                            <a onClick={()=>onDeleteSnapshotImgs(index)} style={{marginLeft:8}}><CloseSquareOutlined style={{color:'#fff',fontSize:'20px'}} /></a>
        
                          </div>
                        </div>

                      </div>
                    )
                  })}
                  <div
                      style={{width:'150px', height:'150px', position:'relative', textAlign:'center', border:'1px solid #ddd'}}>
                      <a>
                          <label htmlFor='addInputs'>
                            <PlusSquareOutlined style={{ fontSize:'40px', marginTop:'50px'}}/>
                          </label>
                          <input type="file" id='addInputs'  accept='image/*' onChange={handleAddFiles}  style={{display:'none'}} />
                      </a>

                  </div>
                  </div>
                </td>
            </tr> */}
         
            <tr>
              <td>?????? ??????</td>
              <td colSpan={3}>
                {workTypeList?.filter((e: any) => e.cateCode !== CUSTOM_CATE_CODE && e.codeName).map((item:any, index:number)=>{
                  return(
                    <Form.Check
                      key={`activeList-${index}`}
                      type='checkbox'
                      inline
                      id={`${item.mainGubun}/${item.subGubun}/${item.cateCode}`}
                      label={item.codeName}
                      checked={item.isActive?true:false}
                      onChange={() => setWorkTypeList(index)}
                    />
                  )
                })}
                <InputGroup className="mb-3" >
                      <Form.Control
                       type='text'
                        placeholder="?????? ??????"
                        value={customTagText}
                        id="????????????"
                        onChange={onChange}
                      />
                      <Button 
                      variant="outline-secondary" 
                      id="button-addon2"
                      onClick={()=>onAddCustomWorkTypeList(customTagText)}
                      >
                        ??????
                      </Button>
                </InputGroup>
                {customWorkTypeList.map((e: any, i: number) => {
                if(!e.codeName) return null
                return (
                  <>
                  <ListGroup horizontal>
                    <ListGroup.Item>
                      {e.codeName}
                      <a onClick={() => onDeleteCusotomWorkTypeList(i)}>
                        <CloseCircleOutlined
                         style={{marginLeft:'10px'}}
                        />
                      </a>
                    </ListGroup.Item>
                  </ListGroup>
                  </>
                )
              })}
              </td>
            </tr>
            <tr>
              <td>??????????????? ??????</td>
              <td colSpan={3}>
              <textarea
               placeholder="??????????????? ??????"
               id='??????'
               value={description}
               onChange={onChange}
               style={{width:'100%', height:'300px', border:'1px solid #ddd'}}
              
              />
               
              </td>
            </tr>
          </tbody>
        </Table>
        <Row className="justify-content-md-center" style={{ margin: '20px 0' }}>
          <Col md={{ span: 7, offset: 5 }}>
            <Button style={{ marginLeft: '10px' }} variant="outline-primary" onClick={goBack}>??????</Button>
            <Button style={{ marginLeft: '10px' }} variant="outline-primary" onClick={onEdit}>??????</Button>
          </Col>
        </Row>


      </Container>

 </Container>

  )
}