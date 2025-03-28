"use client";

//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { useInterfaceContext } from '../library-provider';

//// 1.3 React components
import TableView from './display-table';
import CardView from './display-card';
import CardEditor from './edit-mode';
import LogUpdate from './log-update';

//// 1.4 Utility functions
import sortUidObjectByValue from '@/app/utility/function/object/sort-uid-object-by-value';

//// 1.5 Public and others
////     N/A


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
    const search_target = content["id"] + " " + content["name"] + " " + content["tag"];

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
