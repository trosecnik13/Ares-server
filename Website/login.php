<?php
    session_start();

    $username = $_POST["username"];
    $password = $_POST["password"];

    $_SESSION['username'] = $username;

    $json = file_get_contents('/root/Ares/users.json');
    
    $json_data = json_decode($json,true);
      
    if ($json_data[$username][0] == $password) {
        echo "Login successful <br>";
        echo '<form action="upload_profile_picture.php" method="post" enctype="multipart/form-data">';
            echo 'Select <b>profile picture</b> to upload:';
            echo '<input type="file" name="fileToUpload" id="fileToUpload">';
            echo '<input type="submit" value="Upload Image" name="submit">';
        echo '</form>';

        echo '<form action="upload_profile_banner.php" method="post" enctype="multipart/form-data">';
            echo 'Select <b>profile banner</b> to upload:';
            echo '<input type="file" name="fileToUpload" id="fileToUpload">';
            echo '<input type="submit" value="Upload Image" name="submit">';
        echo '</form>';
    }
    else {
        echo "Login failed!";
    }
?>