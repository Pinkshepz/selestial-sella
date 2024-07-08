"use client";

import { useInterfaceContext } from '../provider';

import TableView from './display-table';
import CardView from './display-card';

import CardEditor from './edit-mode';
import LogUpdate from './log-update';

export default function CourseDisplay({
  contentData
}: {
  contentData: {[key: string]: {[key: string]: any}}
}) {

  // connect to interface context
  const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
  // Filter by search key
  let filteredContent: {[key: string]: {[key: string]: any}} = {};
  for (let index = 0; index < Object.values(contentData).length; index++) {
    // Each content data
    const content: {[key: string]: any} = Object.values(contentData)[index];
    // Create combination of all content information for search target
    const search_target = content["id"] + " " + content["name"] + " " + content["tag"];

    // Check if data matches to searchkey
    if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
      filteredContent[Object.keys(contentData)[index]] = content;
    }
  }

  if (Object.keys(interfaceParams.logUpdate).length > 0) {
    return <LogUpdate />
  } 
  else if (interfaceParams.editMode) {
    return <CardEditor contentData={contentData} />;
  } else if (interfaceParams.displayToggle) {
    return <TableView contentData={filteredContent} />;
  } else {
    return <CardView contentData={filteredContent} />;
  }
}
