import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from "react-native-vector-icons/Ionicons";
import { Box, Heading, Center, Link, Button } from "native-base";

import { AuthContext } from "../../Context/AuthContext";
import { BASE_URL } from "../../utils/apiUrls";
import { handleError } from "../../utils/LocalStoreCustomFunc";
import { getHeader } from "../../utils/Header";
import Loading from "../../utils/Loading";

import axios from "axios";

const CustomerInvoiceListScreen = ({ navigation }) => {
  const [invoiceItems, setInvoiceItems] = useState("");
  const { user } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);

  const getCreateServiceList = async () => {
    const headers = await getHeader();
    await axios
      .get(`${BASE_URL}/invoice/?service__customer=${user?.id}`, {
        headers,
      })
      .then((res) => {
        // console.log(res.data);
        setInvoiceItems(res.data);
      })
      .catch((error) => handleError(error));
    // console.log('Clicked!');
    setPageLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getCreateServiceList();
  }, [])
  );

  if (pageLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#bab9b6" }}>
      <View
        style={{
          backgroundColor: "#286fad",
          width: "100%",
          height: 100,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          shadowColor: "#4a4848",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        }}
      ></View>

      <FlatList
        h="100%"
        w="100%"
        style={{
          flex: 1,
          backgroundColor: "#dbd9d9",
          marginTop: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Heading size="md" color="#333" mt="5" ml="5">
              Invoice List View
            </Heading>
            <Heading size="md" color="#333" mt="5" mr="5">
              All ({invoiceItems.length})
            </Heading>
          </View>
        }
        ListEmptyComponent={
          <Center
            style={{
              paddingVertical: 120,
              paddingHorizontal: 50,
            }}
          >
            <ImageBackground
              source={require("../../../assets/images/no-data.gif")}
              style={{
                width: 250,
                height: 250,
              }}
            />
          </Center>
        }
        data={invoiceItems}
        renderItem={({ item }) => (
          <Box
            bg="#fff"
            width="90%"
            alignSelf="center"
            mt="3"
            p="3"
            rounded="lg"
            shadow={2}
            mb="2"
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                opacity: 0.5,
              }}
            >
              {item.service.title}
            </Text>

            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ opacity: 0.5, marginTop: 5 }}>
                Total Cost: ৳ {item.tech_charge + item.equip_charge}
              </Text>
              <Text
                style={{
                  backgroundColor: "#71bfe3",
                  padding: 3,
                  width: 120,
                  borderRadius: 5,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                Service No.{item.service.servicereq_no}
              </Text>
            </View>

            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link
                isExternal
                _text={{
                  color: "white",
                  fontSize: "sm",
                  textDecoration: "none",
                }}
                style={{
                  backgroundColor: "#286fad",
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  borderRadius: 5,
                  justifyContent: "center",
                }}
                href={`${BASE_URL}/download-invoice/${item.id}`}
              >
                Download
              </Link>

              <Button
                size="sm"
                colorScheme="primary"
                variant="subtle"
                onPress={() =>
                  navigation.navigate("Customer Invoice Details", {
                    invoice: item,
                  })
                }
              >
                View Details
              </Button>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="calendar"
                  size={15}
                  style={{ marginRight: 3 }}
                  color="#bdbbbb"
                />
                <Text
                  style={{
                    opacity: 0.5,
                  }}
                >
                  Issued: {item.created_at}
                </Text>
              </View>
            </View>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default CustomerInvoiceListScreen;
