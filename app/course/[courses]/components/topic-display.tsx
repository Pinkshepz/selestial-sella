"use client";

import { useInterfaceContext } from '../../course-provider';
import sortUidObjectByValue from '@/app/libs/utils/sort-uid-object-by-value';;

export default function TopicDisplay({
  courseTopicData
}: {
  courseTopicData: {[key: string]: {[key: string]: string}}
}) {

  // connect to interface context
  const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
  // Filter by search key
  let filteredContent: {[key: string]: {[key: string]: string}} = {};
  for (let index = 0; index < Object.values(courseTopicData).length; index++) {
    // Each content data
    const content: {[key: string]: string} = Object.values(courseTopicData)[index];
    // Create combination of all content information for search target
    const search_target = content["id"] + " " + content["name"] + " " + content["tag"];

    // Check if data matches to searchkey
    if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
      filteredContent[Object.keys(courseTopicData)[index]] = content;
    }
  }

  const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
    filteredContent, "id", interfaceParams.sortAscending
  )

  
}
