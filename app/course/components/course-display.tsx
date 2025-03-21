"use client";

import { useInterfaceContext } from '../course-provider';
import sortUidObjectByValue from '@/app/libs/utils/sort-uid-object-by-value';

import TableView from './display-table';
import CardView from './display-card';
import CardEditor from './edit-mode';
import LogUpdate from './log-update';

export default function CourseDisplay({
  contentData
}: {
  contentData: {[key: string]: {[key: string]: string}}
}) {

  // connect to interface context
  const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
  // Filter by search key
  let filteredContent: {[key: string]: {[key: string]: string}} = {};
  for (let index = 0; index < Object.values(contentData).length; index++) {
    // Each content data
    const content: {[key: string]: string} = Object.values(contentData)[index];
    // Create combination of all content information for search target
    const search_target = JSON.stringify(content);

    // Check if data matches to searchkey
    if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
      filteredContent[Object.keys(contentData)[index]] = content;
    }
  }

  const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
    filteredContent, "id", interfaceParams.sortAscending
  )

  if (Object.keys(interfaceParams.logUpdate).length > 0) {
    return <LogUpdate />
  } 
  else if (interfaceParams.editMode) {
    return <CardEditor contentData={contentData} />;
  } else if (interfaceParams.displayToggle) {
    return <TableView contentData={sortedFilteredContentData} />;
  } else {
    return <CardView contentData={sortedFilteredContentData} />;
  }
}
