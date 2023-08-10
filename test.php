<?php

include "./config.php";
$userId = $_GET['userId'];
$activityId = $_GET['activityId'];

$sql1 = "DELETE FROM collect WHERE userId = '$userId' AND activityId = '$activityId'";


if ($conn->query($sql1)) {
    $sql3 = "UPDATE activity SET collectNum=collectNum-1 WHERE activityId = '$activityId'";
    if ($conn->query($sql3)) {
        echo json_encode(array(
            "code" => 200,
            "message" => "移除收藏成功",
            "data" => []
        ), JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode(array(
        "code" => 206,
        "message" => "移出收藏",
        "data" => []
    ), JSON_UNESCAPED_UNICODE);
}
