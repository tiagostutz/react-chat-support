import React, { Component } from 'react';

import { 
  IconButton,
  CloseIcon,
  TitleBar,
  AgentBar,
  Row,
  Column,
  Avatar,
  Title,
  Subtitle,
  RateGoodIcon,
  RateBadIcon,
  TextInput,
  TextComposer,
  Fill,
  MessageList,
  SendButton,
  Fit
} from '@livechat/ui-kit'

export default ({
  minimize, 
  title, 
  attendantAvatarURL, 
  attendantTitle, 
  attendantSubtitle, 
  showPoweredBy=true,
  sessionTopic
}) => {
  
  const messageListStyle = {
    flexGrow: 1,
    minHeight: 0,
    height: '100%',
  }
  
  const poweredByStyle = {
    textAlign: 'center',
    fontSize: '.6em',
    padding: '.4em',
    background: '#F7F7F7',
    color: '#AAA',
  }

  const onRateGoodClick = () => {

  } 

  const onRateBadClick = () => {

  }

  return  (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <TitleBar
        rightIcons={[
          <IconButton key="close" onClick={ minimize }>
            <CloseIcon />
          </IconButton>,
        ]}
        title={title}
      />

      <AgentBar>
        <Row flexFill>
          
          <Column>
            <Avatar imgUrl={attendantAvatarURL} />
          </Column>

          <Column flexFill>
            <Title>{attendantTitle}</Title>
            <Subtitle>{attendantSubtitle}</Subtitle>
          </Column>

          <Column flexFit>            
            <Row>
              <IconButton>
                <RateGoodIcon onClick={ onRateGoodClick } style={{
                  opacity: '0.5'
                }} />
              </IconButton>
              <IconButton>
                <RateBadIcon onClick={ onRateBadClick} style={{
                  opacity: '0.5'
                }} />
              </IconButton>
            </Row>            
          </Column>

        </Row>
      </AgentBar>   

      <div style={messageListStyle}>
        <MessageList active containScrollInSubtree>
          
        </MessageList>
      </div>

      <TextComposer>
        <Row align="center">
          <Fill>
            <TextInput />
          </Fill>
          <Fit>
            <SendButton />
          </Fit>
        </Row>
      </TextComposer>

      <div style={poweredByStyle}>
        {showPoweredBy && 'Powered by Chimp Assist'}
      </div>                

    </div>
  )
}