"use client";

//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { useLocalCourseContext } from "@/app/course/local-course-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import sortUidObjectByValue from '@/app/utility/function/object/sort-uid-object-by-value';;

//// 1.5 Public and others
////     N/A


export default function TopicDisplay({
  courseTopicData
}: {
  courseTopicData: {[key: string]: {[key: string]: string}}
}) {

  ////// A.II Connect local context: /app/course/*
  const {localCourseContextParams, setLocalCourseContextParams} = useLocalCourseContext();
  
  // Filter by search key
  let filteredContent: {[key: string]: {[key: string]: string}} = {};
  for (let index = 0; index < Object.values(courseTopicData).length; index++) {
    // Each content data
    const content: {[key: string]: string} = Object.values(courseTopicData)[index];
    // Create combination of all content information for search target
    const search_target = content["id"] + " " + content["name"] + " " + content["tag"];

    // Check if data matches to searchkey
    if (search_target.toLowerCase().includes(localCourseContextParams.searchKey.toLowerCase())) {
      filteredContent[Object.keys(courseTopicData)[index]] = content;
    }
  }

  const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
    filteredContent, "id", localCourseContextParams.sortAscending
  )

  
}
